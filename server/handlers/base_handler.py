import tornado.web

import db


class BaseHandler(tornado.web.RequestHandler):
    def initialize(self):
        self.db_session = db.db_session()

    def on_finish(self):
        self.db_session.close()
