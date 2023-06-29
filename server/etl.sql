CREATE DATABASE dog;

CREATE TABLE dog (
  breed TEXT, 
  count TEXT
  ); 

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
    "id": "3",
    "type": "transform",
    "data": {
      "prev": "2",
      "label": "QUERY",
      "jsCode": "for(const prop in data.message) {if (!data.message.breed) {data.message.breed=[{breed:prop, num:data.message[prop].length}]} else {data.message.breed.push({breed:prop, num:data.message[prop].length})}} data = data.message.breed;",
      "output": ""
    },
    "position": {
      "x": 425,
      "y": 5
    },
    "targetPosition": "left"
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
      "output": ""
    },
    "position": {
      "x": 210,
      "y": 90
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
      "dbName": "dog",
      "sqlCode": "INSERT INTO dog(breed, count) VALUES(${breed}, ${num});",
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



