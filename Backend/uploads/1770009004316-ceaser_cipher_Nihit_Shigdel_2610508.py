def main():
    '''
    Main function that shows the flow of the entire code
    Take no parameters
    Returns no values
    '''
    
    welcome()
    while True:
        messages = message_or_file()
        mode = messages[1]
        while True:
            try:
                shift_num = int(input("What is the shift number (1-24): "))
                if 1 <= shift_num <= 24:
                    break
                else:
                    print("Shift must be between 1 and 24")
            except ValueError:
                print("Please enter a valid number")
        if messages[2] != '':
            if mode == 'e':
                result = write_message(encrypt(' '.join(messages[0]).upper(), shift_num))
                print("File written successful")
            elif mode == 'd':
                result = write_message(decrypt(' '.join(messages[0]).upper(), shift_num))
                print("File written successful")
        else:     
            if mode == 'e':
                encrypted_word = encrypt(messages[0], shift_num)
                print(encrypted_word)
            elif mode == 'd':
                decrypted_word = decrypt(messages[0], shift_num)
                print(decrypted_word)
        while True:
            confirm = input("Would you like to encrypt or decrypt another message (y/n): ").lower()
            if confirm == 'y':
                break
            elif confirm == 'n':
                print("Thank you for playing!!")
                return

def welcome():
    '''
    Displays the welcome message at the start
    Take no arguments
    Returns no value
    '''
    
    print('''Welcome to the Ceaser Cipher
This program encrypts and decrypts text using Ceaser Cipher''')

def message_or_file():
    '''
    Prompts the user for encrypt or decrypt and also prompts the user for console or file
    Takes no arguments
    Returns a tuple as (result, mode, filename)
    '''
    
    while True:
        mode = input("Would you like to encrypt (e) or decrypt (d): ").lower()
        filename = ''
        if mode == 'e':
            while True:
                user_req = input("Would you like to see from a console (c) or a file (f): ").lower()
                if user_req == 'c':
                    result = input("What message would you like to encrypt: ").upper()
                    break
                elif user_req == 'f':
                    while True:
                        filename = input("Enter the name of the file: ")
                        if is_file(filename):
                            result = process_file(filename, mode)
                            break
                        else:
                            print("File not found. Please enter a valid name")
                            continue
                    break
                else:
                    print("Invalid Value. Please enter a valid value")
                    continue
            break
        elif mode == 'd':
            while True:
                user_req = input("Would you like to see from a console (c) or a file (f): ").lower()
                if user_req == 'c':
                    result = input("What message would you like to decrypt: ").upper()
                    break
                elif user_req == 'f':
                    while True:
                        filename = input("Enter the name of the file: ")
                        if is_file(filename):
                            result = process_file(filename, mode)
                            break
                        else:
                            print("File not found. Please enter a valid name")
                            continue
                    break
                else:
                    print("Invalid Value. Please enter a valid value")
                    continue
            break
        else:
            continue
    return result, mode, filename

def process_file(filename, mode):
    '''
    Process the file to read and encrypt or decrypt the content of the file
    Takes 2 arguments: filename, mode
    Returns a list: list as word_list
    '''
    
    word_list = []
    file_path = f"{filename}.txt"
    if mode == 'e':
        with open(file_path, 'r') as file:
            for line in file:
                words = line.split()
                for word in words:   
                    word_list.append(word)
    elif mode == 'd':
        with open(file_path, 'r') as file:
            for line in file:
                words = line.split()
                for word in words:
                    word_list.append(word)
    return word_list
def write_message(words):
    '''
    Writes a message to a file called result.txt
    Takes 1 arguments: list as words
    Returns no value
    '''
    
    with open(r'results.txt', 'w') as file:
        for word in words:
            file.write(word)
def is_file(filename):
    '''
    Checks if the file is present in the user's device or not
    Takes 1 arguments: String as filename
    Returns boolean value
    '''
    
    file_path = f"{filename}.txt"
    try:
        file = open(file_path, 'r')
    except FileNotFoundError:
        return False
    else:
        return True
'''
Was used for the initial prototype of the console only design
'''
def enter_message():
    
    while True:
        mode = input("Would you like to encrypt (e) and decrypt (d) ? :").lower()
        if mode == 'e':
            word = input("What message would you like to encrypt: ").upper()
            while True:
                shift_num = int(input("What is the shift number: "))
                if shift_num > 0 and shift_num < 25:
                    break
            break
        elif mode == 'd':
            word = input("What message would you like to decrypt: ").upper()
            while True:
                shift_num = int(input("What is the shift number: "))
                if shift_num > 0 and shift_num < 25:
                    break
            break
        else:
            print("Invalid Value. Please enter a valid value")
            continue
    return word , shift_num, mode


def encrypt(word, shift_num):
    '''
    Encrypts the word with Ceaser Cipher logic
    Takes 2 arguments: String as word, Integer as shift_num
    Returns 1 value: String Encrypted_word
    '''
    encrypt_list = []
    encrypt_words = word.split()
    for each in encrypt_words:
        result = ''
        for char in each:
            if char.isalpha():
                new_shift = (ord(char) - ord('A') + shift_num) % 26
                new_char = chr(new_shift + ord('A'))
                result += new_char
            else:
                result += char
        encrypt_list.append(result)
    return ' '.join(encrypt_list)
        
def decrypt(word, shift_num):
    '''
    Decrypts the word with Ceaser Cipher Logic
    Takes 2 arguments: Stringn as word, Interger as shift_num
    Returns 1 value: String Decrypted_word
    '''
    decrypt_list = []
    decrypt_words = word.split()
    for each in decrypt_words:
        result = ''
        for char in each:
            if char.isalpha():
                new_shift = (ord(char) - ord('A') - shift_num) % 26
                new_char = chr(new_shift + ord('A'))
                result += new_char
            else:
                result += new_char
        decrypt_list.append(result)
    return ' '.join(decrypt_list)
    
'''
Calling the main function
'''
main()
