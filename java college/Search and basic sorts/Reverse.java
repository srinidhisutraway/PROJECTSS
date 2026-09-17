import java.util.Scanner;
public class Reverse {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        String n=sc.next();
        System.out.println(Rev(n));        
    }
    static String Rev(int n){
        if(n == 0) return "0"; 
        String rev="";
        while(n!=0){
            int var=n%10;
            rev=rev+var;
            n/=10;
        }
        return rev;

    }
    
}
