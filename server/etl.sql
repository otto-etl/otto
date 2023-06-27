CREATE DATABASE etl;

CREATE TABLE workflow (
  id SERIAL PRIMARY KEY, 
  name VARCHAR(255), 
  active BOOLEAN, 
  nodes JSONB, 
  created_at TIMESTAMPTZ, 
  updated_at TIMESTAMPTZ, 
  edges JSONB,
  settings JSONB, 
  static_data JSONB, 
  start_time TIMESTAMPTZ
);

INSERT INTO workflow VALUES (
  1, 'workflow 1', false, 
  '[
  {
    "id": "1",
    "type": "trigger",
    "data": {
      "label": "Schedule",
      "startTime" : "26 Jun 2023 7:16:00 CST",
      "intervalInMinutes": "1",
      "output": ""
    },
    "position": {
      "x": 0,
      "y": 50
    },
    "sourcePosition": "right"
  },
  {
    "id": "2",
    "type": "extract",
    "data": {
      "prev": "1",
      "label": "API",
      "url": "https://dog.ceo/api/breeds/list/all",
      "httpVerb": "GET",
      "jsonBody": {},
      "output": {
    "message": {
        "affenpinscher": [],
        "african": [],
        "airedale": [],
        "akita": [],
        "appenzeller": [],
        "australian": [
            "shepherd"
        ],
        "basenji": [],
        "beagle": [],
        "bluetick": [],
        "borzoi": [],
        "bouvier": [],
        "boxer": [],
        "brabancon": [],
        "briard": [],
        "buhund": [
            "norwegian"
        ],
        "bulldog": [
            "boston",
            "english",
            "french"
        ],
        "bullterrier": [
            "staffordshire"
        ],
        "cattledog": [
            "australian"
        ],
        "chihuahua": [],
        "chow": [],
        "clumber": [],
        "cockapoo": [],
        "collie": [
            "border"
        ],
        "coonhound": [],
        "corgi": [
            "cardigan"
        ],
        "cotondetulear": [],
        "dachshund": [],
        "dalmatian": [],
        "dane": [
            "great"
        ],
        "deerhound": [
            "scottish"
        ],
        "dhole": [],
        "dingo": [],
        "doberman": [],
        "elkhound": [
            "norwegian"
        ],
        "entlebucher": [],
        "eskimo": [],
        "finnish": [
            "lapphund"
        ],
        "frise": [
            "bichon"
        ],
        "germanshepherd": [],
        "greyhound": [
            "italian"
        ],
        "groenendael": [],
        "havanese": [],
        "hound": [
            "afghan",
            "basset",
            "blood",
            "english",
            "ibizan",
            "plott",
            "walker"
        ],
        "husky": [],
        "keeshond": [],
        "kelpie": [],
        "komondor": [],
        "kuvasz": [],
        "labradoodle": [],
        "labrador": [],
        "leonberg": [],
        "lhasa": [],
        "malamute": [],
        "malinois": [],
        "maltese": [],
        "mastiff": [
            "bull",
            "english",
            "tibetan"
        ],
        "mexicanhairless": [],
        "mix": [],
        "mountain": [
            "bernese",
            "swiss"
        ],
        "newfoundland": [],
        "otterhound": [],
        "ovcharka": [
            "caucasian"
        ],
        "papillon": [],
        "pekinese": [],
        "pembroke": [],
        "pinscher": [
            "miniature"
        ],
        "pitbull": [],
        "pointer": [
            "german",
            "germanlonghair"
        ],
        "pomeranian": [],
        "poodle": [
            "medium",
            "miniature",
            "standard",
            "toy"
        ],
        "pug": [],
        "puggle": [],
        "pyrenees": [],
        "redbone": [],
        "retriever": [
            "chesapeake",
            "curly",
            "flatcoated",
            "golden"
        ],
        "ridgeback": [
            "rhodesian"
        ],
        "rottweiler": [],
        "saluki": [],
        "samoyed": [],
        "schipperke": [],
        "schnauzer": [
            "giant",
            "miniature"
        ],
        "segugio": [
            "italian"
        ],
        "setter": [
            "english",
            "gordon",
            "irish"
        ],
        "sharpei": [],
        "sheepdog": [
            "english",
            "shetland"
        ],
        "shiba": [],
        "shihtzu": [],
        "spaniel": [
            "blenheim",
            "brittany",
            "cocker",
            "irish",
            "japanese",
            "sussex",
            "welsh"
        ],
        "spitz": [
            "japanese"
        ],
        "springer": [
            "english"
        ],
        "stbernard": [],
        "terrier": [
            "american",
            "australian",
            "bedlington",
            "border",
            "cairn",
            "dandie",
            "fox",
            "irish",
            "kerryblue",
            "lakeland",
            "norfolk",
            "norwich",
            "patterdale",
            "russell",
            "scottish",
            "sealyham",
            "silky",
            "tibetan",
            "toy",
            "welsh",
            "westhighland",
            "wheaten",
            "yorkshire"
        ],
        "tervuren": [],
        "vizsla": [],
        "waterdog": [
            "spanish"
        ],
        "weimaraner": [],
        "whippet": [],
        "wolfhound": [
            "irish"
        ]
    },
    "status": "success"
}
    },
    "position": {
      "x": 210,
      "y": 90
    },
    "targetPosition": "left"
  },
  {
    "id": "3",
    "type": "transform",
    "data": {
      "prev": "2",
      "label": "QUERY",
      "jsCode": "delete message.beagle",
      "output": ""
    },
    "position": {
      "x": 425,
      "y": 5
    },
    "targetPosition": "left"
  },
  {
    "id": "4",
    "type": "load",
    "data": {
      "prev": "3",
      "label": "POSTGRES",
      "userName": "postgres",
      "password": "password",
      "port": "5432",
      "sqlCode": "INSERT INTO breed() VALUES()",
      "output": ""
    },
    "position": {
      "x": 650,
      "y": 75
    },
    "targetPosition": "left"
  }
]',
NOW(),
NOW(),
'[
  {
    "id": "e1-2",
    "source": "1",
    "target": "2",
    "animated": false,
    "style": {
      "stroke": "#000033"
    }
  },
  {
    "id": "e2-3",
    "source": "2",
    "target": "3",
    "animated": false,
    "style": {
      "stroke": "#000033"
    }
  },
  {
    "id": "e3-4",
    "source": "3",
    "target": "4",
    "animated": false,
    "style": {
      "stroke": "#000033"
    }
  }
]',
'{}',
'{}',
NULL
);





