from tornado import escape

from handlers.base_handler import BaseHandler
from models.record import RecordModel
from models.voice import VoiceModel


class RecordHandler(BaseHandler):
    def get(self, record_id=None):
        """
        /records        获取记录列表
        /records/{id}   获取指定记录
        :return:
        """
        user_id = 1

        try:
            record_id  = int(record_id)
            record = RecordModel.get_by_id(record_id, user_id)
        except ValueError:
            keyword = self.get_argument('keyword', '')
            record = RecordModel.get_list(user_id, keyword)

        self.write({'data': RecordModel.transform(record)})

    def put(self, record_id):
        """
        /records/{id}   修改记录
        :return:
        """
        user_id = 1
        record_id = int(record_id)
        RecordModel.update_by_id(
            record_id=record_id,
            user_id=user_id,
            text=self.get_argument('text')
        )

    def delete(self, record_id):
        """
        /records/{id}   删除记录
        /records?       批量删除记录
        :return:
        """
        user_id = 1
        record_id = int(record_id)
        RecordModel.delete_by_id(record_id=record_id, user_id=user_id)
