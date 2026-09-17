n1=int(input("Enter a number n1:"))
n2=int(input("Enter a number n2:"))

def ambi(num1,num2):
    sum1=0
    sum2=0
    for i in range(1,num1):
        if num1%i==0:
            sum1+=i
    for i in range(1,num2):
        if num2%i==0:
            sum2+=i
    if sum1==num2 and sum2==num1:
        print("The numbers are ambicable")
    else:
        print("Numbers are not ambicable")
ambi(n1,n2)
