# Variables
nombre_iteration = 10
string = "abcdefghijklmonpqrstuvwxyz"

my_list = []
for item in range(0, nombre_iteration):
    my_list.append(f"{string}\n")

my_file = open(f"Monfichier{nombre_iteration}.txt", "w")    
my_file.writelines(my_list)
my_file.close()
