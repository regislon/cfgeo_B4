import random
import string

letters = string.ascii_lowercase # Get all lowercase letters


# Variables
nombre_iteration = 10

my_list = []
for item in range(0, nombre_iteration):
    random_letters = ''.join(random.choice(letters) for i in range(26))
    my_list.append(f"{random_letters}\n")

my_file = open(f"Monfichier_random_letters{nombre_iteration}.txt", "w")    
my_file.writelines(my_list)
my_file.close()
