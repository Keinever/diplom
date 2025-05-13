from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class Courses(models.Model):
    course_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    teacher = models.ForeignKey('TeacherProfile', models.DO_NOTHING)
    students = models.ManyToManyField(
        'StudentProfile',
        related_name='courses',
        blank=True,
        verbose_name='Студенты курса'
    )

    class Meta:
        db_table = 'Courses'

class Modules(models.Model):
    module_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Courses, models.CASCADE, related_name='modules')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateTimeField()
    total_points = models.IntegerField()
    attempts_limit = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'Modules'


class Progress(models.Model):
    progress_id = models.AutoField(primary_key=True)
    student = models.ForeignKey('StudentProfile', models.DO_NOTHING)
    course = models.ForeignKey(Courses, models.DO_NOTHING)
    completed_labs = models.IntegerField(blank=True, null=True)
    total_labs = models.IntegerField(blank=True, null=True)
    average_grade = models.FloatField(blank=True, null=True)

    class Meta:
        db_table = 'Progress'


class Solutions(models.Model):
    solution_id = models.AutoField(primary_key=True)
    student = models.ForeignKey('StudentProfile', models.DO_NOTHING)
    lab = models.ForeignKey(Modules, models.DO_NOTHING)
    solution_data = models.TextField(blank=True, null=True)
    grade = models.IntegerField(blank=True, null=True)
    submitted_at = models.DateTimeField(blank=True, null=True)
    rating = models.FloatField(blank=True, null=True)
    attempts_left = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'Solutions'


class Steps(models.Model):
    step_id = models.AutoField(primary_key=True)
    title = models.TextField()
    description = models.TextField()
    exercise_type = models.CharField(max_length=50)
    module = models.ForeignKey(Modules, models.CASCADE, db_column='module_id', related_name='steps')
    lab_number = models.IntegerField(blank=True, null=True)
    score = models.IntegerField(blank=True, null=True)
    step_file = models.BinaryField(blank=True, null=True)
    attemts = models.ManyToManyField(
        'StudentProfile',
        through='StudentStepAttempt',
        related_name='steps'
    )

    class Meta:
        db_table = 'Steps'


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email обязателен')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class CustomUser(AbstractUser):
    ROLES = (
        ('student', 'Студент'),
        ('teacher', 'Преподаватель'),
    )

    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLES)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

class StudentProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='student_profile')
    group = models.ForeignKey('Groups', models.SET_NULL, blank=True, null=True)
    isu_id = models.CharField(unique=True, max_length=20, blank=True, null=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=255)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    attempts = models.ManyToManyField(
        'Steps',
        through='StudentStepAttempt',
        related_name='student_attempts'
    )

    def __str__(self):
        return f"{str(self.first_name).capitalize()} {str(self.last_name).capitalize()}"


class TeacherProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='teacher_profile')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=255)
    middle_name = models.CharField(max_length=50, blank=True, null=True)


class Groups(models.Model):
    group_number = models.CharField(max_length=15, primary_key=True)

    class Meta:
        db_table = 'Groups'

class StudentStepAttempt(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    step = models.ForeignKey(Steps, on_delete=models.CASCADE)
    attempts = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = [['student', 'step']]