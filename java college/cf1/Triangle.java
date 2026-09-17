import java.util.Scanner;

public class Triangle {
    public static void main(String[] args) {
          Scanner sc=new Scanner(System.in);
        int n;
        n=sc.nextInt();
        for(int i=1;i<=n;i++){
            for(int j=1;j<=i;j++){
                 if(j>=i){
                    System.out.print("");
                }
                System.out.print(" *");
               
            }
            System.out.println();
        }
        
         sc.close();
    }
    
}
