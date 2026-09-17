import java.util.*;
public class Summ {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int a=sc.nextInt();
        int b=sc.nextInt();
        int c=sum(a,b);
        System.out.println(c);
    }
    static int sum(int a,int b){
        if(a==0)
            return b;
        else if(b==0)
            return a;
        else{
            return sum(a,b-1)+1;
        }

        
    }
    
}
