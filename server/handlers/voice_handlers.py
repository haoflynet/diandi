from handlers.base_handler import BaseHandler
from models.voice import VoiceModel


class VoiceHandler(BaseHandler):
    def get(self, voice_id):
        """
        /voices/{id}    获取指定语音
        :return:
        """
        user_id = 1

        try:
            voice_id = int(voice_id)
            voice = VoiceModel.get_by_id(self.db_session, voice_id)
            if voice is None:
                self.set_status(404)
                self.write({'code': 404, 'message': 'voice not found'})
                return
        except ValueError:
            voice_id = None
            # TODO: 没有获取语音列表

        self.write({'code': 200, 'message': '开发中'})

    def post(self, voice_id=None):
        """
        /voices 创建语音
        :return:
        """
        user_id = 1
        VoiceModel.store(self.db_session,
                         user_id = user_id,
                         text = self.get_argument('text'))

        # TODO: AIUI
        self.write({'code': 200})

