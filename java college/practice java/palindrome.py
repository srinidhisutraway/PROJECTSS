n=int(input("Enter a number:"))

def pali(n):
    original=n
    rev=0
    while(n>0):
        num=n%10
        rev=rev*10+num
        n=n//10
    if(original==rev):
        print("palindrome")
    else:
        print("not a palindrome")
pali(n)
        