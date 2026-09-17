n=int(input("n:"))
count=0
lst=[]
for i in range(n):
    lst.append(int(input()))

for i in range(len(lst)-1):
    if(lst[i]==lst[i+1]):
        count+=1
print("Count is",count)