import time
import base64
import hashlib
import os
import requests

from settings.constants import AIUI_APP_ID, AIUI_API_KEY


class AIUI:
    """
    讯飞语音开放平台
    """
    base_url = 'http://api.xfyun.cn'

    def __init__(self, app_id, api_key):
        self.app_id = app_id
        self.api_key = api_key

    def iat(self, filename):
        """
        语音识别接口(将自然语言识别为文本输出)
        :return:
        """
        path = '/v1/aiui/v1/iat'
        if not os.path.isfile(filename):
            raise FileNotFoundError('file({}) not found.'.format(filename))

        with open(filename, 'rb') as fp:
            data = 'data=' + base64.b64encode(fp.read()).decode('utf-8')

        params = '{"auf":"16k","aue":"raw","scene":"main"}'

        r = requests.post(self.base_url + path, headers=self.generate_header(params, data), data=data)
        print(r.json()['data'])
        return r.json()['data']['result']

    def voice_semantic(self, filename):
        """
        语音语义接口(先将自然语言识别为文本，后对该文本进行解释分析，返回文本的语义意图)
        :param filename:
        :return:
        """
        path = '/v1/aiui/v1/voice_semantic'
        if not os.path.isfile(filename):
            raise FileNotFoundError('file({}) not found.'.format(filename))

        with open(filename, 'rb') as fp:
            data = 'data=' + base64.b64encode(fp.read()).decode('utf-8')

        params = '{"auf":"16k","aue":"raw","scene":"main","userid":"user_0001"}'

        r = requests.post(self.base_url + path, headers=self.generate_header(params, data), data=data)
        print(r.text)

    def text_semantic(self, text):
        """
        文本语义接口
        :param text:
        :return:
        """
        path = '/v1/aiui/v1/text_semantic'
        params = '{"scene":"main", "userid":"user_0001"}'
        base64_text = base64.b64encode(bytes(text.encode('utf-8'))).decode('utf-8')
        data = 'text=' + str(base64_text)
        r = requests.post(self.base_url + path, headers=self.generate_header(params,data), data=data)
        print(r.text)

    def generate_header(self, params, data):
        """
        生成X-CheckSum
        :return:
        """
        current_time = str(int(time.time()))
        params = base64.b64encode(bytes(params.encode('utf-8'))).decode('utf-8')
        check_sum = hashlib.md5((self.api_key + current_time + params + data).encode('utf-8')).hexdigest()

        return {
            'X-Appid': self.app_id,
            'X-CurTime': current_time,
            'X-Param': params,
            'X-CheckSum': check_sum,
            'Content-Type': 'application/x-www-form-urlencoded',
            'charset': 'utf-8'
        }


if __name__ == '__main__':
    aiui = AIUI(app_id=AIUI_APP_ID, api_key=AIUI_API_KEY)
    # aiui.iat('16k.pcm')
    # aiui.voic_semantic('16k.pcm')
    aiui.text_semantic('明天8点提醒我起床')
