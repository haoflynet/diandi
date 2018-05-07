from handlers.base_handler import BaseHandler
from models.voice import VoiceModel


class VoiceHandler(BaseHandler):
    def get(self, voice_id):
        """
        /voices/{id}    获取指定语音
        :return:
        """
        if isinstance(voice_id, int):
            voice = VoiceModel.get_by_id(self.db_session, voice_id)
        else:
            voice = VoiceModel.get_list(self.db_session)
        print(voice)
        self.write('ok')

    def post(self):
        """
        /voices 创建语音
        :return:
        """
        pass
