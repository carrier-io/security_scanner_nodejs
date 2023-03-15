from typing import Optional
from pylon.core.tools import log
from pydantic import BaseModel


class IntegrationModel(BaseModel):
    save_intermediates_to: Optional[str] = '/data/intermediates/sast'
    devdep: Optional[bool] = False
    composition_analysis: Optional[bool] = False

    def check_connection(self) -> bool:
        try:
            return True
        except Exception as e:
            log.exception(e)
            return False
    

