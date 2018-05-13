from handlers.base_handler import BaseHandler
# from models import RecordModel
from models.record import RecordModel


class RecordHandler(BaseHandler):
    def get(self, record_id):
        """
        /records        获取记录列表
        /records/{id}   获取指定记录
        :return:
        """
        user_id = 1

        try:
            record_id  = int(record_id)
            record = RecordModel.get_by_id(self.db_session, record_id, user_id)
        except ValueError:
            record = RecordModel.get_list(self.db_session, user_id)
            keyword = self.get_argument('keywords')
            # TODO: 提取关键字进行搜索

        self.write({'data': RecordModel.transform(record, self.db_session, user_id)})

    def put(self, record_id):
        """
        /records/{id}   修改记录
        :return:
        """
        user_id = 1
        record_id = int(record_id)
        RecordModel.update_by_id(
            self.db_session,
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
        RecordModel.delete_by_id(self.db_session, record_id=record_id, user_id=user_id)
