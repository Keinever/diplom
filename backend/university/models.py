from django.db import models


class Courses(models.Model):
    course_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    teacher = models.ForeignKey('Teachers', models.DO_NOTHING)
    students = models.ManyToManyField(
        'Students',
        related_name='courses',
        blank=True,
        verbose_name='Студенты курса'
    )

    class Meta:
        db_table = 'Courses'

class Modules(models.Model):
    module_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Courses, models.DO_NOTHING)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateTimeField()
    total_points = models.IntegerField()
    attempts_limit = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'Modules'


class Progress(models.Model):
    progress_id = models.AutoField(primary_key=True)
    student = models.ForeignKey('Students', models.DO_NOTHING)
    course = models.ForeignKey(Courses, models.DO_NOTHING)
    completed_labs = models.IntegerField(blank=True, null=True)
    total_labs = models.IntegerField(blank=True, null=True)
    average_grade = models.FloatField(blank=True, null=True)

    class Meta:
        db_table = 'Progress'


class Solutions(models.Model):
    solution_id = models.AutoField(primary_key=True)
    student = models.ForeignKey('Students', models.DO_NOTHING)
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
    module_id = models.ForeignKey(Modules, models.DO_NOTHING, db_column='module_id')
    lab_number = models.IntegerField(blank=True, null=True)
    score = models.IntegerField(blank=True, null=True)
    step_file = models.BinaryField(blank=True, null=True)
    attemts = models.ManyToManyField(
        'Students',
        through='StudentStepAttempt',
        related_name='steps'
    )

    class Meta:
        db_table = 'Steps'


class Students(models.Model):
    student_id = models.AutoField(primary_key=True)
    group = models.ForeignKey('Groups', models.DO_NOTHING)
    isu_id = models.CharField(unique=True, max_length=20)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=255)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    attempts = models.ManyToManyField(
        'Steps',
        through='StudentStepAttempt',
        related_name='student_attempts'
    )
    
    
    class Meta:
        db_table = 'Students'


class Teachers(models.Model):
    teacher_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=255)
    middle_name = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'Teachers'

class Groups(models.Model):
    group_id = models.AutoField(primary_key=True)
    group_number = models.CharField(max_length=15)

    class Meta:
        db_table = 'Groups'

class StudentStepAttempt(models.Model):
    student = models.ForeignKey(Students, on_delete=models.CASCADE)
    step = models.ForeignKey(Steps, on_delete=models.CASCADE)
    attempts = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = [['student', 'step']]