from handlers.base_handler import BaseHandler
# from models import AlarmModel
from models.alarm import AlarmModel


class AlarmHandler(BaseHandler):
    def get(self, alarm_id):
        """
        /alarms 获取提醒列表
        :return:
        """
        user_id = 1

        try:
            alarm_id = int(alarm_id)
            alarm = AlarmModel.get_by_id(alarm_id, user_id)
            if alarm is None:
                self.set_status(404)
                self.write({'code': 404, 'message': 'alarm not found'})
                return
        except ValueError:
            # TODO: 这里的user_id来自于query
            alarm = AlarmModel.get_list(user_id)

        self.write({'data':AlarmModel.transform(alarm)})

    def post(self, alarm_id=None):
        """
        /alarms 直接创建提醒
        :return:
        """
        AlarmModel.store(user_id = 1,
                         cycle_unit = self.get_argument('cycle_unit', 'NONE'),
                         cycle_count = self.get_argument('cycle_count', 0),
                         next_time = self.get_argument('next_time')
                         )
        self.write({'code': 200})


    def put(self, alarm_id):
        """
        /alarms/{id}    修改指定提醒
        :return:
        """
        user_id = 1
        alarm_id = int(alarm_id)
        AlarmModel.update_by_id(user_id = 1,
                         alarm_id = alarm_id,
                         cycle_unit = self.get_argument('cycle_unit', 'NONE'),
                         cycle_count = self.get_argument('cycle_count', 0),
                         next_time = self.get_argument('next_time')
                         )
        self.write({'code': 200})

    def patch(self, alarm_id):
        """
        /alarms/{id}    更新指定提醒
        :param alarm_id:
        :return:
        """
        user_id = 1
        alarm_id = int(alarm_id)
        AlarmModel.update_by_id(user_id = 1,
                                alarm_id = alarm_id,
                                expired = self.get_argument('expired', None))
        self.write({'code': 200})

    def delete(self, alarm_id):
        """
        /alarms/{id}    删除指定提醒
        :return:
        """
        user_id = 1
        alarm_id = int(alarm_id)
        AlarmModel.delete_by_id(alarm_id, user_id)
