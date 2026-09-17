num=int(input('Enter a value:'))
new=0
while num!=0:
    n=num%10
    new=new+n
    num=num//10
print(new)

