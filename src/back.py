from psycopg2 import OperationalError
import psycopg2
import flask
import json
from flask_cors import CORS, cross_origin
import hashlib
from _datetime import datetime

app = flask.Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
connection = psycopg2.connect(user='postgres', password='', host='127.0.0.1', port='5433',
                              database='TODO')


def password_hash(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


# Новый пользователь
def new_user(login, password, first_name, middle_name, last_name, supervisor_id):
    t = datetime.now()
    salt = t.strftime('%M%S%h')
    salt = login[0] + salt + login[3]
    s_password = password_hash(password + salt)
    cursor = connection.cursor()
    cursor.execute('INSERT INTO users (login, passh, salt,first_name,middle_name,last_name,supervisor_id)'
                   ' VALUES (%s,%s,%s,%s,%s,%s,%s)',
                   (login, s_password, salt, first_name, middle_name, last_name, supervisor_id))
    connection.commit()


def to_json(data):
    return json.dumps(data)


# Ответ на запрос
def resp(code, data):
    return flask.Response(
        status=code,
        mimetype="application/json",
        response=to_json(data)
    )


# Запрос к бд логин/пароль
def select(login, password=0):
    cursor = connection.cursor()
    if password == 0:
        cursor.execute('SELECT COUNT(1) FROM users WHERE login=' + '\'' + login + '\'')
    else:
        cursor.execute('SELECT COUNT(1) FROM users WHERE login = ' + '\'' + login +
                       '\'' + ' and passh = ' + '\'' + password + '\'')
    record = cursor.fetchone()
    return record


# Новая задача
def create_task(title, description, task_end, priority, creator_id, responsible):
    t = datetime.now().strftime('%Y-%m-%d')
    print(t)
    status = 'К выполнению'
    cursor = connection.cursor()
    cursor.execute('INSERT INTO tasks (title, description, task_start, task_end, updated, priority, status, creator_id, responsible) '
        'VALUES (%s, %s, CURRENT_DATE, %s, CURRENT_DATE, %s, %s , %s, %s)', (title, description, task_end,
                                                                             priority, status, creator_id, responsible))
    connection.commit()


# Мои задачи
def select_todo_list(id):
    cursor = connection.cursor()
    cursor.execute('SELECT json_agg(tasks) FROM tasks WHERE responsible =' +str(id))
    record = cursor.fetchall()
    return record[0][0]

s = select_todo_list(36)
print(s)

# Задачи подчиненных
def select_sub_todo_list(id):
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM tasks WHERE creator_id =' + str(id))
    record = cursor.fetchall()
    return record


# Проверка логина/пароля
@app.route('/user', methods=['POST'])
@cross_origin()
def root():  # Проверка логина/пароля
    login = flask.request.json['login']
    password = flask.request.json['password']
    cursor = connection.cursor()
    cursor.execute('SELECT salt FROM users WHERE login =' + '\'' + login + '\'')
    salt = cursor.fetchone()
    a = select(login)
    if a[0] == 0:
        return resp(200, 0)
    else:
        s_password = password + salt[0]
        s_password = password_hash(s_password)
        a = select(login, s_password)
        if a[0] == 0:
            return resp(200, 1)
    return resp(200, 2)


@app.route('/todo_list', methods=['GET'])
@cross_origin()
def todo_list():
    print(select_todo_list(36))
    return resp(200, select_todo_list(36))


if __name__ == '__main__':
    app.run()
