import os
import logging
from pymongo import MongoClient
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Init MongoDB connection
mongo_uri = f'mongodb://{os.environ.get("MONGO_HOST")}:{os.environ.get("MONGO_PORT")}'
db = MongoClient(mongo_uri)['test_db']

class TodoListView(APIView):

#to fetch all records
    def get(self, request):
        try:
            todos = []
            for todo in db.todos.find():
                todo['_id'] = str(todo['_id'])
                todos.append(todo)
            return Response(todos, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"GET error: {e}")
            return Response({"error": "Internal error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
#for inserting the record
    def post(self, request):
        try:
            data = request.data
            title = data.get('title')
            
            if not title:
                return Response({"error": "Title is required"}, status=status.HTTP_400_BAD_REQUEST)
                
            new_todo = {
                "title": str(title).strip(),
                "completed": data.get("completed", False)
            }
            
            res = db.todos.insert_one(new_todo)
            new_todo['_id'] = str(res.inserted_id)
            return Response(new_todo, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logging.error(f"POST error: {e}")
            return Response({"error": "Internal error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)