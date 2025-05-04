from django.db import models

# Модель для тем курса
class CourseTopic(models.Model):
    topic_id = models.AutoField(primary_key=True)
    topic_name = models.CharField(max_length=100)

    class Meta:
        db_table = 'course_topics'

    def __str__(self):
        return self.topic_name

# Модель для подтем
class Subtopic(models.Model):
    subtopic_id = models.AutoField(primary_key=True)
    topic = models.ForeignKey(CourseTopic, on_delete=models.CASCADE, to_field='topic_id')
    subtopic_name = models.CharField(max_length=100)

    class Meta:
        db_table = 'subtopics'

    def __str__(self):
        return f"{self.topic.topic_name} - {self.subtopic_name}"

# Модель для лабораторных работ
class Lab(models.Model):
    lab_id = models.AutoField(primary_key=True)
    subtopic = models.ForeignKey(Subtopic, on_delete=models.CASCADE, to_field='subtopic_id')
    lab_name = models.CharField(max_length=100)
    have_attestation = models.BooleanField(default=True)
    have_training = models.BooleanField(default=True)

    class Meta:
        db_table = 'labs'

    def __str__(self):
        return self.lab_name

# Модель для пользователей
class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    isu_id = models.CharField(max_length=6, unique=True)
    role = models.CharField(max_length=20, choices=[('student', 'Student'), ('teacher', 'Teacher'), ('admin', 'Admin')])
    group_name = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.full_name} ({self.role})"

# Модель для заданий
class Assignment(models.Model):
    assignment_id = models.AutoField(primary_key=True)
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, to_field='lab_id')
    is_exam = models.BooleanField(default=False)
    deadline = models.DateTimeField()

    class Meta:
        db_table = 'assignments'

    def __str__(self):
        return f"{self.lab.lab_name} - Deadline: {self.deadline}"

# Модель для попыток выполнения заданий
class Attempt(models.Model):
    attempt_id = models.AutoField(primary_key=True)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, to_field='assignment_id')
    user = models.ForeignKey(User, on_delete=models.CASCADE, to_field='user_id')
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(blank=True, null=True)
    score = models.IntegerField(blank=True, null=True)
    is_passed = models.BooleanField(default=False)

    class Meta:
        db_table = 'attempts'

    def __str__(self):
        return f"{self.user.full_name} - {self.assignment.lab.lab_name} (Score: {self.score})"
