n=int(input("n:"))
def propdiv(num):
    divisor=[]
    for i in range(1,num):
        if num%i==0:
            divisor.append(i)
        else:
            continue
    return divisor
print(propdiv(n))