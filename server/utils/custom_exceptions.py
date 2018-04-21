class ErrorMsg(dict):
    """自定义错误类"""
    def __init__(self, e: Exception, code: int, data=''):
        dict.__init__(self, msg=str(e), code=code, data=data)