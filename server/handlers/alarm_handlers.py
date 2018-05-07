from handlers.base_handler import BaseHandler


class AlarmHandler(BaseHandler):
    def get(self):
        """
        /alarms 获取提醒列表
        :return:
        """
        self.write('ok')

    def post(self):
        """
        /alarms 直接创建提醒
        :return:
        """
        pass

    def put(self):
        """
        /alarms/{id}    修改指定提醒
        :return:
        """
        pass

    def delete(self):
        """
        /alarms/{id}    删除指定提醒
        :return:
        """
        pass