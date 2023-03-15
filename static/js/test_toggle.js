const nodejsIntegration = {
    delimiters: ['[[', ']]'],
    props: ['instance_name', 'section', 'selected_integration', 'is_selected', 'integration_data'],
    emits: ['set_data', 'clear_data'],
    data() {
        return this.initialState()
    },
    computed: {
        body_data() {
            const {
                description,
                is_default,
                selected_integration: id,
                save_intermediates_to,
                devdep,
                composition_analysis,
            } = this
            return {
                description,
                is_default,
                id,
                save_intermediates_to,
                devdep,
                composition_analysis,
            }
        },
    },
    watch: {
        selected_integration(newState, oldState) {
            console.debug('watching selected_integration: ', oldState, '->', newState, this.integration_data)
            this.set_data(this.integration_data?.settings, false)
        }
    },
    methods: {
        get_data() {
            if (this.is_selected) {
                return this.body_data
            }
        },
        set_data(data, emit = true) {
            Object.assign(this.$data, data)
            emit&& this.$emit('set_data', data)
        },
        clear_data() {
            Object.assign(this.$data, this.initialState())
            this.$emit('clear_data')
        },

        handleError(response) {
            try {
                response.json().then(
                    errorData => {
                        errorData.forEach(item => {
                            console.debug('nodejs item error', item)
                            this.error = {[item.loc[0]]: item.msg}
                        })
                    }
                )
            } catch (e) {
                console.log(e)
                alertCreateTest.add(e, 'danger-overlay')
            }
        },

        initialState: () => ({
            // toggle: false,
            error: {},
            save_intermediates_to: '/data/intermediates/sast',
            devdep: false,
            composition_analysis: false,
        })
    },
    template: `
        <div class="mt-3">
            <div class="row">
                <div class="col">
                    <h7>Advanced Settings</h7>
                    <p>
                        <h13>Integration default settings can be overridden here</h13>
                    </p>
                </div>
            </div>
            <div class="form-group">
                <form autocomplete="off">
                    <div class="mb-2">
                        <h9>Scan Options</h9>
                    </div>
                    <div class="row">
                        <div class="pl-2">
                            <label class="custom-checkbox align-items-center mr-3">
                                <input type="checkbox" v-model="devdep">
                                <h9 class="ml-1">
                                    Add dependencies from devDependencies
                                </h9>
                            </label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="mb-3 p-2">
                            <label class="custom-checkbox align-items-center mr-3">
                                <input type="checkbox" v-model="composition_analysis">
                                <h9 class="ml-1">
                                    Enable composition analysis
                                </h9>
                            </label>
                        </div>
                    </div>
                    <div>
                        <h9>Save intermediates to</h9>
                        <p>
                            <h13>Optional</h13>
                        </p>
                        <input type="text" class="form-control form-control-alternative"
                            placeholder=""
                            v-model="save_intermediates_to"
                            :class="{ 'is-invalid': error.save_intermediates_to }">
                        <div class="invalid-feedback">[[ error.save_intermediates_to ]]</div>
                    </div>
                </form>
            </div>
        </div>
    `
}


register_component('scanner-nodejs', nodejsIntegration)

