import java.util.Scanner;
public class Fact {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt();
        
        System.out.println(factt(n));
    }
    static int factt(int n){
        if(n==0 || n==1)
            return 1;
        else if(n>1)
            return n*factt(n-1);
        else return 0;
    }
}

    

