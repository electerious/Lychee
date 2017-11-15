### Upload image by post

- You can upload image by HTTP post with identifier to accesss.

### Post file by `multipart/form-data` 

`Python` demo:

```python
import requests

url = 'http://localhost/php/index.php'

fields = {
    'function': 'Photo::add',   # Controller
    'albumID': 's',  # album id, default s is a public album
    'identifier': 'change-to-identifier-in-database',
}

files = {
    '0': ('file_name.jpg', open('/path/to/file_name.jpg', 'rb')),
}

response = requests.post(url, files=files, data=fields)

print(response.status_code)
print(response.text)
```
