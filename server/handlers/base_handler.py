import tornado.web

import db


class BaseHandler(tornado.web.RequestHandler):
    def initialize(self):
        self.db_session = db.DB_Session()

    def on_finish(self):
        self.db_session.close()