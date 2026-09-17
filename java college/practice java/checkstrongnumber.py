n=int(input("n:"))
num=n

def strong_num(n):
    q=0
    while(n!=0):
        m=n%10
        p=fact(m)
        q+=p
        n=n//10
    if q==num:
        print("is a strong number")
    else:
        print("not a strong number")

def fact(m):
            if(m==0 or m==1):
                return 1
            else:
                return m*fact(m-1)
strong_num(n)
