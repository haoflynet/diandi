import time
import base64
import hashlib
import os
import requests

from aip import AipSpeech


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

    def semantic(self, file):
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

class AIP:
    def __init__(self, app_id, api_key, secret_key):
        self.app_id = app_id
        self.api_key = api_key
        self.secret_key = secret_key

        self.client = AipSpeech(app_id, api_key, secret_key)

    def asr(self, file):
        if not os.path.isfile(file):
            raise FileNotFoundError('file not found.')

        with open(file, 'rb') as fp:
            data = fp.read()

        result = self.client.asr(data, 'pcm', 16000, {
            'lan': 'zh'
        })

        print(result)



if __name__ == '__main__':
    aiui = AIUI(app_id='5aafd315', api_key='b1a60f922e714d3a97cd0d6a7427c258')
    # aiui.iat('16k.pcm')
    # aiui.iat('16k.wav')
    # aiui.iat('test1.wav')


    aip = AIP(app_id='10984376', api_key='VCSjERT5wOGky0m0oEo4Gp0u', secret_key='8900a719be155289705a85bd631c5a93')

    lines = []
    for i in range(1, 17):
        file = '/Users/haofly/workspace/record-remind-everything/audios/' + str(i) + '.pcm'

        aiui.semantic(file)
    #     # aip.asr(file)
    #     lines.append(aiui.iat(file) + '\n')
    #
    # with open('result', 'w') as fp:
    #     print(lines)
    #     fp.writelines(lines)

        # aip.asr(str(i)+'.pcm')
