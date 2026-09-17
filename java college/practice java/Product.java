import java.util.*;
public class Product {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int a=sc.nextInt();
        int b=sc.nextInt();
        int c=prod(a,b);
        System.out.println(c);
    }
    static int prod(int a,int b){
        if(a==0 || b==0)
            return 0;
        else
            return prod(a,b-1)+a;//for power we do *a instead of +a
        
    }

}
