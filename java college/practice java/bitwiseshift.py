num=int(input("num:"))
n=int(input("n:"))

def shift(num,n):
    for i in range(1,n+1):
        num=num>>1
    return num
print(shift(num,n))   