n=int(input("n:"))
def gen_fibo(num):
    fibo=[]
    for i in range(0,num):
        fibo.append(fibon(i))
    return fibo
def fibon(num):
    if(num==0):
        return 0
    elif(num==1):
        return 1
    else:
        return fibon(num-1)+fibon(num-2)
print(gen_fibo(n))