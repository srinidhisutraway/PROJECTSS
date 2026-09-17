import java.util.Scanner;
public class Looop {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n;
        n=sc.nextInt();
        for(int i=1;i<=n;i++){
 
              for(int j=0;j<n-i;j++){
                System.out.print(" ");//if i then same number pyramid if j then 1234 123..pyramidwill occur
              }
              for(int j=0;j<i-1\;j++){
                System.out.print("*");//if i then same number pyramid if j then 1234 123..pyramidwill occur
              }
              System.out.println();}
              for(int i=n;i>=0;i--){
 
              for(int j=0;j<n-i;j++){
                System.out.print(" ");//if i then same number pyramid if j then 1234 123..pyramidwill occur
              }
              for(int j=0;j<i-1;j++){
                System.out.print("*");//if i then same number pyramid if j then 1234 123..pyramidwill occur
              }
              System.out.println();}
        sc.close();
        
    }
    
}

