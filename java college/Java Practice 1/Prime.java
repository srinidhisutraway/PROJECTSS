import java.util.Scanner;

public class Prime {
    public static void main(String[] args) {
         Scanner sc= new Scanner(System.in);
        long n=sc.nextLong();
        Pri p=new Pri();
        p.p(n);
    }
    
}
class Pri{
    void p(long n){
        long count=0;
        for(long i=1;i*i<=n;i++){
            if(n%i==0){
                count=count+1;

            }
        }
        if(count>=2){
            System.out.println("Not Prime");
        }
        else if(n<=1){
            System.out.println("Not Prime");
        }
        else{
            System.out.println("Prime");
        }
    }
}
