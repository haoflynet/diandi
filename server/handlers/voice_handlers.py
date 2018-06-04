import json

import jieba
from tornado import escape

from handlers.base_handler import BaseHandler
from models.alarm import AlarmModel
from models.record import RecordModel
from models.voice import VoiceModel, VoiceTypeEnum
from utils.aiui import AIUI, AiuiIntent


class VoiceHandler(BaseHandler):
    def get(self, voice_id=None):
        """
        /voices/{id}    获取指定语音
        :return:
        """
        user_id = 1
        voice = []
        paginator = {}

        try:
            voice_id = int(voice_id)
            voice = VoiceModel.get_by_id(voice_id=voice_id, user_id=user_id)
            if voice is None:
                self.set_status(404)
                self.write({'code': 404, 'message': 'voice not found'})
                return
        except ValueError:
            """这儿相当于timeline"""
            keyword = self.get_argument('keyword', None)
            type = self.get_argument('type', VoiceTypeEnum.RECORD)
            page = self.get_argument('page', 1)
            limit = self.get_argument('limit', 20)
            voice, paginator = VoiceModel.get_list(user_id, keyword, type, page, limit)

        self.write({
            'data': VoiceModel.transform(voice),
            'paginator': paginator,
        })

    def post(self, voice_id=None):
        """
        /voices 创建语音
        :return: alarm
        """
        user_id = 1
        data = escape.json_decode(self.request.body)
        voice = VoiceModel.store(user_id = user_id,
                         type = data['type'],
                         text = data['text'])

        if data['type'] == 'ALARM':
            aiui_result, result_code = AIUI.aiui().text_semantic(data['text'])

            voice.update(
                correct_text=aiui_result['text'],
                result = json.dumps(aiui_result)
            )

            semantic = aiui_result['semantic'][0]
            alarm_dict = getattr(AiuiIntent, semantic['intent'])(semantic)
            voice.update(
                correct_text=alarm_dict['text'],
                result_code=result_code
            )
            alarm = AlarmModel.store(user_id = user_id,
                            cycle_unit = alarm_dict['cycle_unit'],
                            cycle_count = alarm_dict['cycle_count'],
                            next_time = alarm_dict['next_time'],
                            voice_id = voice.id,
                            )
            self.write({
                'code': 200,
                'data': {
                    'alarm': AlarmModel.transform(alarm),
                }
            })
        elif data['type'] == 'RECORD':
            record = RecordModel.store(
                user_id = user_id,
                voice_id = voice.id,
                words = ','.join(jieba.cut_for_search(data['text']))
            )
            self.write({
                'code': 200,
                'data': {
                    'alarm': RecordModel.transform(record),
                }
            })
        else:
            raise Exception('no finish')


