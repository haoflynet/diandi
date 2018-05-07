from handlers.base_handler import BaseHandler


class RecordHandler(BaseHandler):
    def get(self):
        """
        /records        获取记录列表
        /records/{id}   获取指定记录
        :return:
        """
        self.write('ok')

    def post(self):
        """
        /records    创建记录
        :return:
        """
        pass

    def put(self):
        """
        /records/{id}   修改记录
        :return:
        """
        pass

    def delete(self):
        """
        /records/{id}   删除记录
        /records?       批量删除记录
        :return:
        """
        pass