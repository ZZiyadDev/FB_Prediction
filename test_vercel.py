import urllib.request, re
try:
    html = urllib.request.urlopen('https://fb-prediction-m6nak55mb-ziyaddev.vercel.app/').read().decode('utf-8')
    js_path = re.search(r'src="(/assets/index-[^"]+\.js)"', html)
    if js_path:
        js_url = 'https://fb-prediction-m6nak55mb-ziyaddev.vercel.app' + js_path.group(1)
        js_code = urllib.request.urlopen(js_url).read().decode('utf-8')
        match = re.search(r'baseURL:\s*"([^"]+)"', js_code)
        print('Vercel is connecting to:', match.group(1) if match else 'No baseURL found')
    else:
        print('JS not found')
except Exception as e:
    print('Error:', e)
