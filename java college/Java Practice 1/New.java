import java.util.Scanner;

public class New {
    public static void main(String[] args) {
        Scanner sc= new Scanner(System.in);
        int n=sc.nextInt();
        for(int i=1;i<=n;i++){
            for(int j=1;j<=n-i;j++){
                System.out.print(" ");
            }


            for(int j=1;j<=i;j++){
                 
                 System.out.print("*");
                 if(j<i){
                    System.out.print(" ");
                 }
                }
                
                
            System.out.println();
        }
        for(int i=1;i<=n;i++){
            for(int j=1;j<=i;j++){
                System.out.print(" ");
            }


            for(int j=1;j<=n-i;j++){
                 
                 System.out.print("*");
                 if(j<n-i){
                    System.out.print(" ");
                 }
                }
                
                
            System.out.println();
        }
    }
    
    }
