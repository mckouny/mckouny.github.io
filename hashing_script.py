import bcrypt
import json
import re
salt = bcrypt.gensalt(4)
#known_commands = []

with open('commands_curated.json', 'r') as fp:
    known_commands = json.load(fp)

with open("/home/hyg/.bash_history", "r") as f:
    output = open("exampleoutput.txt", "w+")
    for line in f:
        line = line.split()

        for word in line:
            if word in known_commands: #finding commands from list + operators
                output.write(word + " ")
            
            elif re.match(r"^-\w{1,4}$", word): #matching single dash flags (max 4 characters)
                output.write(word + " ")

            elif re.match(r"^-(-\w{1,10}){1,4}$", word): #matching double dash flags
                output.write(word + " ")

            else:
                hashed = str(bcrypt.hashpw(word.encode('utf8'), salt))
                output.write(hashed + " ")   

        output.write("\n")
            
    f.close()
    output.close()
