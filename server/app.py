import tornado.httpserver
import tornado.ioloop
import tornado.web

from settings.constants import SERVER_IP, SERVER_PORT
from urls import url_patterns


def make_app():
    return tornado.web.Application(url_patterns,
                                   autoreload=True)


if __name__ == "__main__":
    app = make_app()
    app.listen(SERVER_PORT, SERVER_IP)
    print('* Running on http://{address}:{port}/ (Press CTRL+C to quit)'.format(address=SERVER_IP, port=SERVER_PORT))
    tornado.ioloop.IOLoop.current().start()
