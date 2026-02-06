# Student Name: Aaryan Rokaya

def welcome():
    print("Hey! Welcome to my Caesar Cipher program")
    print("It can encrypt or decrypt messages")

def encrypt(message, shift):
    encrypted_message = ""
    for letter in message:
        if letter.isalpha():
            new_letter = ord(letter) + shift
            if new_letter > ord('Z'):
                new_letter -= 26  # wrap around
            encrypted_message += chr(new_letter)
        else:
            encrypted_message += letter
    return encrypted_message

def decrypt(message, shift):
    decrypted_message = ""
    for letter in message:
        if letter.isalpha():
            new_letter = ord(letter) - shift
            if new_letter < ord('A'):
                new_letter += 26  # wrap around
            decrypted_message += chr(new_letter)
        else:
            decrypted_message += letter
    return decrypted_message

def main():
    welcome()
    choice = input("Do you want to encrypt (e) or decrypt (d)? ").lower()
    message = input("Type your message: ").upper()
    shift = int(input("How many letters to shift? "))

    if choice == 'e':
        print("Encrypted message:", encrypt(message, shift))
    else:
        print("Decrypted message:", decrypt(message, shift))

    print("Thanks for trying my program! Bye")

main()
