import time
import base64
import hashlib
import os
import requests

from settings.constants import AIUI_APP_ID, AIUI_API_KEY


class AIUI:
    base_url = 'http://api.xfyun.cn'

    def __init__(self, app_id, api_key):
        self.app_id = app_id
        self.api_key = api_key

    def iat(self, file):
        """
        语音识别接口
        :return:
        """
        path = '/v1/aiui/v1/iat'
        if not os.path.isfile(file):
            raise FileNotFoundError('file({}) not found.'.format(file))

        with open(file, 'rb') as fp:
            data = 'data=' + base64.b64encode(fp.read()).decode('utf-8')

        params = '{"auf":"16k","aue":"raw","scene":"main"}'

        r = requests.post(self.base_url + path, headers=self.generate_header(params, data), data=data)
        print(r.json()['data'])
        return r.json()['data']['result']

    def voice_semantic(self, file):
        """
        语音语义接口
        :param file:
        :return:
        """
        path = '/v1/aiui/v1/voice_semantic'
        if not os.path.isfile(file):
            raise FileNotFoundError('file({}) not found.'.format(file))

        with open(file, 'rb') as fp:
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
        params = '{"scene":"main","userid":"user_0001"}'
        data = 'text=' + base64.b64encode(bytes(text.encode('utf-8'))).decode('utf-8')

        r = requests.post(self.base_url + path, headers=self.generate_header(params, data), data=data)
        if r.status_code == 200 and r.json()['code'] == '00000':
            return r.json()['data']
        else:
            raise Exception('api exception')

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
    print(aiui.text_semantic('今天星期几'))
