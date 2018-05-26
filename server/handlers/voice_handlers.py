import json

import jieba
from tornado import escape

from handlers.base_handler import BaseHandler
from models.alarm import AlarmModel
from models.record import RecordModel
from models.voice import VoiceModel
from utils.aiui import AIUI, AiuiIntent


class VoiceHandler(BaseHandler):
    def get(self, voice_id=None):
        """
        /voices/{id}    获取指定语音
        :return:
        """
        user_id = 1

        try:
            voice_id = int(voice_id)
            voice = VoiceModel.get_by_id(self.db_session, voice_id=voice_id, user_id=user_id)
            if voice is None:
                self.set_status(404)
                self.write({'code': 404, 'message': 'voice not found'})
                return
        except ValueError:
            """这儿相当于timeline"""
            voice = VoiceModel.get_list(self.db_session, user_id)

        self.write({'data': VoiceModel.transform(voice)})

    def post(self, voice_id=None):
        """
        /voices 创建语音
        :return:
        """
        user_id = 1
        data = escape.json_decode(self.request.body)
        VoiceModel.store(self.db_session,
                         user_id = user_id,
                         text = data['text'])

        # TODO: AIUI
        self.write({'code': 200})

