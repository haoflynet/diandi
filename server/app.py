import tornado.httpserver
import tornado.ioloop
import tornado.web

from urls import url_patterns


def make_app():
    return tornado.web.Application(url_patterns,
                                   autoreload=True)


if __name__ == "__main__":
    address = '127.0.0.1'
    port = 8888

    app = make_app()
    app.listen(port, address)
    print('* Running on http://{address}:{port}/ (Press CTRL+C to quit)'.format(address=address, port=port))
    tornado.ioloop.IOLoop.current().start()
