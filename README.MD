# AWS Lambda + Google Spreadsheet API

> [https://github.com/theoephraim/node-google-spreadsheet](https://github.com/theoephraim/node-google-spreadsheet)

## Usage

```
serverless deploy
```

```
/sheets?docId=__DOC_ID__&headers=NAME|PHONE|ADDRESS&page=1
```

```
{
  "success": true,
  "data": [
    {
      "NAME": "1",
      "PHONE": "2",
      "ADDRESS": "3"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "message": "Successfully!"
}
```

Have fun ;)