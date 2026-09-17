import java.util.Scanner;

public class Factor {
    public static void main(String[] args) {
        Scanner sc= new Scanner(System.in);
        int n=sc.nextInt();
        Facto f=new Facto();
        f.Factors(n);
    }
    
}
class Facto{
    void Factors(int n){
        for(int i=n;i>=1;i--){
            if(n%i==0)
                System.out.print(i+" ");
            
        }

    }
}
