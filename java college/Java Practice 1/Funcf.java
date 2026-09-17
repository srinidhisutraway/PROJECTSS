import java.util.Scanner;

public class Funcf {
    public static void main(String[] args) {
        Function s=new Function();
        Scanner sc= new Scanner(System.in);
        int n=sc.nextInt();
        s.Print(n);
 }   
}
class Function{
    void Print(int n){
   
    for(int i=1;i<=n;i++){
        System.out.println("I am learning functions");
    }

    }
}
