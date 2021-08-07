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
connection = psycopg2.connect(user='postgres', password='Luckerwp908', host='127.0.0.1', port='5433',
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
    return (200)


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
def new_task(title, description, task_end, priority, creator_id, responsible):
    status = 'К выполнению'
    cursor = connection.cursor()
    cursor.execute(
        'INSERT INTO tasks (title, description, task_start, task_end, updated, priority, status, creator_id, responsible) '
        'VALUES (%s, %s, CURRENT_DATE, %s, CURRENT_DATE, %s, %s , %s, %s)', (title, description, task_end,
                                                                             priority, status, creator_id, responsible))
    connection.commit()


# Обновить статус задачи
def update_task_status(task_id, status):
    cursor = connection.cursor()
    cursor.execute('UPDATE tasks SET status = ' + '\'' + status + '\'' + ', updated = CURRENT_DATE' +
                   ' WHERE task_id =' + str(task_id))
    connection.commit()


# Обновить задачу
def update_task(task_id, title, description, task_end, priority, status, responsible):
    cursor = connection.cursor()
    cursor.execute('UPDATE tasks SET title = ' + '\'' + title + '\'' +' , description = ' + '\'' + description + '\'' +', task_end = ' + '\'' + task_end + '\'' +
                   ', updated = CURRENT_DATE, ' + ' priority = ' + '\'' + priority + '\'' + ', status = ' + '\'' + status + '\'' + ', responsible = ' + '\'' + str(responsible) + '\'' +
                   ' WHERE task_id =' + str(task_id))
    connection.commit()


# ID пользователя
def select_user_id(login):
    cursor = connection.cursor()
    cursor.execute('SELECT user_id FROM users WHERE login =' + '\'' + login + '\'')
    record = cursor.fetchone()
    return record[0]


# ID подчиненных
def select_sub_user_id(id):
    cursor = connection.cursor()
    cursor.execute("SELECT user_id, concat(users.first_name, ' ', users.middle_name, ' ', users.last_name) AS resp_name FROM users WHERE supervisor_id =" + str(id))
    record = cursor.fetchall()
    d = []
    for i in range(len(record)):
        d.append({'id': record[i][0], 'name': record[i][1]})
    print(d)
    return d


# Мои задачи
def select_todo_list(user_id, date):
    cursor = connection.cursor()
    if date == 'Now':
        cursor.execute('SELECT json_agg(view_tasks) FROM view_tasks WHERE responsible =' + str(user_id) + 'AND task_end <= CURRENT_DATE ')
    elif date == 'Week':
        cursor.execute('SELECT json_agg(view_tasks) FROM view_tasks WHERE responsible =' + str(user_id) + 'AND task_end <= CURRENT_DATE+6')
    elif date == 'mWeek':
        cursor.execute('SELECT json_agg(view_tasks) FROM view_tasks WHERE responsible =' + str(user_id) + 'AND task_end > CURRENT_DATE+6')
    else:
        cursor.execute('SELECT json_agg(view_tasks) FROM view_tasks WHERE responsible =' + str(user_id))

    record = cursor.fetchall()
    return record[0][0]


# Задачи подчиненных
def select_sub_todo_list(user_id):
    cursor = connection.cursor()
    cursor.execute('SELECT json_agg(view_tasks) FROM view_tasks WHERE creator_id =' + str(user_id))
    record = cursor.fetchall()
    return record[0][0]


# Выбор ID подчиненных
@app.route('/select_resp', methods=['GET'])
@cross_origin()
def select_resp():
    login = flask.request.args.get('login')
    user_id = select_user_id(login)
    return resp(200, select_sub_user_id(user_id))


# Проверка логина/пароля
@app.route('/user', methods=['POST'])
@cross_origin()
def root():
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


# TODO
@app.route('/todo_list', methods=['GET'])
@cross_origin()
def todo_list():
    date = flask.request.args.get('date')
    login = flask.request.args.get('login')
    user_id = select_user_id(login)
    return resp(200, select_todo_list(user_id, date))


# TODO подчиненных
@app.route('/sub_todo_list', methods=['GET'])
@cross_origin()
def sub_todo_list():
    login = flask.request.args.get('login')
    user_id = select_user_id(login)
    return resp(200, select_sub_todo_list(user_id))


# Создание задачи
@app.route('/create_task', methods=['POST'])
@cross_origin()
def create_task():
    title = flask.request.json['title']
    description = flask.request.json['description']
    task_end = flask.request.json['task_end']
    priority = flask.request.json['priority']
    responsible = flask.request.json['responsible']
    creator = flask.request.json['creator']
    creator_id = select_user_id(creator)
    print(title, description, task_end, priority, creator_id, responsible)
    new_task(title, description, task_end, priority, creator_id, responsible)
    return resp(200,1)


# Обновление статуса задачи
@app.route('/update_task_status', methods=['POST'])
@cross_origin()
def task_status():
    task_id = flask.request.json['task_id']
    status = flask.request.json['status']
    print(str(task_id)+' '+status)
    update_task_status(task_id,status)
    return resp(200,1)


# Изменение задачи
@app.route('/update_task', methods=['POST'])
@cross_origin()
def task_update():
    task_id = flask.request.json['task_id']
    title = flask.request.json['title']
    description = flask.request.json['description']
    task_end = flask.request.json['task_end']
    priority = flask.request.json['priority']
    responsible = flask.request.json['responsible']
    status = flask.request.json['status']
    print(title)
    update_task(task_id, title, description, task_end, priority, status, responsible)
    return resp(200,1)



if __name__ == '__main__':
    app.run()
