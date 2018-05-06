import tornado.web

import db
from models import User


class UserHandler(tornado.web.RequestHandler):
    def initialize(self):
        self.db_session = db.DB_Session()

    def on_finish(self):
        self.db_session.close()

    def get(self):
        user = User.get_username(self.db_session, '')
        count = self.db_session.query(User).count()
        self.write('{} users so far!'.format(count))


class UserDetailHandler(tornado.web.RequestHandler):
    def get(self, user_id):
        self.write('user id: ' + user_id)
